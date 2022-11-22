var http = require('http'); //http client to server request 
var mysql = require('mysql'); // mysql start connection with node
var express = require('express'); //to make path..for n no of roots
var cors = require('cors'); // to avoid browser js error .  Cross-Origin Resource Sharing. this is used as localhost:4200 is one origin and backend is localhost:8080 .it is another origin. In order to get access we give cors
var app = express();
const fs = require('fs'); //for photo
const path = require('path') //for photo
const formidable = require('formidable'); //for photo

var bodyParser = require('body-parser');//get, post method parameters catching from request
//mysql start
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "anganwadi"
});
//mysql end

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
    'OPTIONS'
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

//app.use(cors(corsOpts));
//app.use(path, callback)--- syntax
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Max-Age", '86400');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",

  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.options('*', cors(corsOpts));

app.use('*', (req, res, next) => {
  if (req.method == "OPTIONS") {
    res.status(200);
    res.send();
  } else {
    next();
  }
});
// these are all for membership form along with login page of membership-form... start point
// fetching districts fields from master_districts table to html choose option field
app.post('/districts', function (req, res) {
  con.connect(function (err) { //mysql start
    if (err) console.log(err);
    con.query
      ('SELECT district_code,district_desc FROM master_districts ORDER BY district_code,district_desc', [],
      // orderby keyword sorts the order in ascending order bydefault  
      function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.send(JSON.stringify(result));
        });
  });
})

/**fetching projects start! passing master_projects data from server to client** */
app.post('/projects', function (req, res) {
  con.connect(function (err) { //mysql start
    if (err) console.log(err);
    var district_recvd = req.body.district;// here we are getting the value of distrivct that is enterd
    //var district="11";
    // console.log(district);
    con.query
      ('SELECT project_code,project_desc FROM master_projects where district_code=? ORDER BY project_code,project_desc', [district_recvd],
        function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.send(JSON.stringify(result));
        });
  });
})
//fetching projects end

// fetching sectors start
app.post('/sectors', function (req, res) {
  con.connect(function (err) { //mysql start
    if (err) console.log(err);
    // based on the district and project we selected from the form,sector is choosen
    var district_recvd = req.body.district;// here we are getting the value of distrivct that is enterd
    var project_recvd = req.body.project;
   
    con.query
      ('SELECT sector_code,sector_desc FROM master_sectors where district_code=? and project_code=? ORDER BY sector_code,sector_desc', [district_recvd, project_recvd],
        function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.send((result));
        });
  });
})
// sector end.

//insert funda start
app.post('/save', (req, res, next) => {
 //npm install formidable
  const form = new formidable.IncomingForm(); //for form data and file uploads
  form.parse(req, function (err, fields, files) { //fields are for text fields and files are for file uploads
    let aadhar_no = ""; // for saving photo with aadhar number 
    let db_fields = ['aadharno', 'empname', ' dateofbirth', ' sonof', ' gender', ' marital_status', ' category', 'pancard', ' phoneno', ' designation', ' districtcode', 'projectcode', 'sectorcode', 'bankacno', 'ifsccode', 'bankname', 'branchname', ' pay_amt', 'pmnt_dt', ' utr_no', ' p_ad1', ' p_ad2', ' p_village_city', ' p_district', ' p_pin', ' t_ad1', ' t_ad2', ' t_village_city', ' t_district', 't_pin', ' no_shares', ' inst_amt', ' nominee_name', ' nominee_rel', '  nominee_aadhno', ' nominee2_name', ' nominee2_rel', 'nominee2_aadhno', 'centrecode', 'centrearea'];
    let app_fields = ['applicant_aadhno', 'applicant_name', 'applicant_dob', 'applicant_f_h_name', 'applicant_gender', 'applicant_marital_status', 'applicant_caste', 'applicant_pan_no', 'applicant_mobno', 'applicant_desig', 'applicant_dist', 'applicant_proj', 'applicant_sector', 'applicant_bnk_acc_no', 'applicant_ifsc_code', 'applicant_bank_name', 'applicant_branch_name', 'applicant_pmnt_details', 'applicant_dt_of_pmnt', 'applicant_utr_no', 'applicant_door_no', 'applicant_landmark', 'applicant_village_city', 'applicant_district', 'applicant_pincode', 'applicant_temp_door_no', 'applicant_temp_landmark', 'applicant_temp_village_city', 'applicant_temp_district', 'applicant_temp_pincode', 'applicant_no_of_shares', 'applicant_install_amt', 'nominee_name1', 'rel_with_memb1', 'nominee_aadhno1', 'nominee_name2', 'rel_with_memb2', 'nominee_aadhno2', 'applicant_centre_code', 'applicant_centre_area'];
    let sql_query = "insert into master_members ";
    let col_list = "";
    let q_mark_list = "";   //question marl lisk parameterized query we assign ?'s for values
    let value_list = [];
    let keys = Object.keys(fields); // data from client all the key values are present in fields
    // console.log(keys);
    keys.forEach(k => {
      //  console.log(k + "===>" + fields[k] + "====" + db_fields[app_fields.indexOf(k)]);
      //data_for_insertion.photo = this.file;
      if (k != "applicant_age" && (k != "photo")) { //these 2 fields are not passed to database and photo is stored in service itself and age is calculaed in .ts file itself anad passing the value
        col_list += db_fields[app_fields.indexOf(k)] + ","; //we  are matching the app_fields index  field with database field 
        //console.log(col_list);
        q_mark_list += "?,";

        value_list.push(fields[k]);  //fields[k] means we get values of fields corresponding to the key k
       
        if (k == "applicant_aadhno") // for photo save with aadhar no.
          aadhar_no = fields[k];  //let aadhar_no = ""; fields[k] means value.
      }
    });
    sql_query += "(" + (col_list.substring(0, col_list.length - 1)) + ") values (" + q_mark_list.substring(0, q_mark_list.length - 1) + ")";
    //  += means append . append means add to the end and substring(0, col_list.length-1) is used as at last one comma is left and in order to remove this we do substring and do that length-1
    //  console.log(sql_query);
    // console.log(value_list);
    var oldPath = files.photo.filepath;
    var newpath = 'C:/anganwadi_project/src/server_logic/uploads/' + aadhar_no + ".png";
    // console.log(oldPath + "===" + newpath);
    fs.rename(oldPath, newpath, function (err) {
      if (err) console.log(err);
      // res.write('File uploaded and moved!');
      console.log("photo uploaded");
      con.connect(function (err) { //mysql start
        if (err) console.log(err);
        console.log(sql_query);
        console.log(value_list);

        con.query
          (sql_query, value_list,
            function (err, result, fields) {
              if (err) console.log(err);
              // console.log(result);
              res.end("");
            })
      })
    });
  })
});
//insert funda end

// update funda start
app.post('/update', (req, res, next) => {
  console.log("edit");
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) { //fields are for text fields and files are for file uploads
    let aadhar_no = ""; // for saving photo with addhar number and also to update data using client entered aadhar and mobile no that is present in db
    var mobile_no = "";// mobile no
    let db_fields = ['aadharno', 'empname', ' dateofbirth', ' sonof', ' gender', ' marital_status', ' category', 'pancard', ' phoneno', ' designation', ' districtcode', 'projectcode', 'sectorcode', 'bankacno', 'ifsccode', 'bankname', 'branchname', ' pay_amt', 'pmnt_dt', ' utr_no', ' p_ad1', ' p_ad2', ' p_village_city', ' p_district', ' p_pin', ' t_ad1', ' t_ad2', ' t_village_city', ' t_district', 't_pin', ' no_shares', ' inst_amt', ' nominee_name', ' nominee_rel', '  nominee_aadhno', ' nominee2_name', ' nominee2_rel', 'nominee2_aadhno', 'centrecode', 'centrearea'];
    let app_fields = ['applicant_aadhno', 'applicant_name', 'applicant_dob', 'applicant_f_h_name', 'applicant_gender', 'applicant_marital_status', 'applicant_caste', 'applicant_pan_no', 'applicant_mobno', 'applicant_desig', 'applicant_dist', 'applicant_proj', 'applicant_sector', 'applicant_bnk_acc_no', 'applicant_ifsc_code', 'applicant_bank_name', 'applicant_branch_name', 'applicant_pmnt_details', 'applicant_dt_of_pmnt', 'applicant_utr_no', 'applicant_door_no', 'applicant_landmark', 'applicant_village_city', 'applicant_district', 'applicant_pincode', 'applicant_temp_door_no', 'applicant_temp_landmark', 'applicant_temp_village_city', 'applicant_temp_district', 'applicant_temp_pincode', 'applicant_no_of_shares', 'applicant_install_amt', 'nominee_name1', 'rel_with_memb1', 'nominee_aadhno1', 'nominee_name2', 'rel_with_memb2', 'nominee_aadhno2', 'applicant_centre_code', 'applicant_centre_area'];
    let sql_query = "update master_members set ";
    let col_list = "";
    let value_list = [];
    //let mob_no='';
    // console.log(fields);
    //console.log(files);
    let keys = Object.keys(fields); // key..values of html are in fields  
    //console.log(keys);
    keys.forEach(k => {
      console.log(k + "===>" + fields[k] + "====" + db_fields[app_fields.indexOf(k)]);
      //console.log()
      if (k != "applicant_age" && (k != "photo")) {
        sql_query += db_fields[app_fields.indexOf(k)] + "=?,"; //we  are matching the app_fields index  field with database field 
        //console.log(col_list);
        //these are for updating the data which was fetched from db to html.Based on these aadhar number and mobile number if ut matches with the data base we retrieve the data and can update them if needed.
        value_list.push(fields[k]);  //fields[k] means we get values of fields corresponding to the key k
        // we update the data when we retrieve the data based on aadhar no and mobile no.To Those data we can edit
        if (k == "applicant_aadhno") // for photo save with aadhar no. we are assigning this
          aadhar_no = fields[k]; 
        if (k == "applicant_mobno") 
          mobile_no = fields[k];
        // if(k=="applicant_mobno")
        // mob_no=fields[k];
      }
    });
    value_list.push(aadhar_no);
    value_list.push(mobile_no);
    sql_query = sql_query.substring(0, sql_query.length - 1) + " where aadharno=? and phoneno=?";
    //  += means append and substring(0, col_list.length-1) is used as at last one comma is left and in order to remove this we do substring and do that length-1
   // console.log(sql_query);
    // console.log(value_list);
    //res.send('');
   // console.log(files);
    if(Object.keys(files).length>0){
    var oldPath = files.photo.filepath;
      var newpath = 'C:/anganwadi_project/src/server_logic/uploads/' + aadhar_no + ".png";
      // console.log(oldPath + "===" + newpath);
      fs.rename(oldPath, newpath, function (err) {
        if (err) console.log(err);
        // res.write('File uploaded and moved!');
        console.log("photo uploaded");
       
      });
    }
        con.query
          (sql_query, value_list,
            function (err, result, fields) {
              if (err) console.log(err);
              // console.log(result);
              res.end("");
            })
  })
});
// update funda end

//fetch user details start//
app.post('/userdetails', function (req, res) {
  //  con.connect(function (err) { //mysql start
  //  if (err) console.log(err);
  let db_fields = ['aadharno', 'empname', 'dateofbirth', 'sonof', ' gender', ' marital_status', ' category', 'pancard', ' phoneno', ' designation', ' districtcode', 'projectcode', 'sectorcode', 'bankacno', 'ifsccode', 'bankname', 'branchname', ' pay_amt', 'pmnt_dt', ' utr_no', ' p_ad1', ' p_ad2', ' p_village_city', ' p_district', ' p_pin', ' t_ad1', ' t_ad2', ' t_village_city', ' t_district', 't_pin', ' no_shares', ' inst_amt', ' nominee_name', ' nominee_rel', '  nominee_aadhno', ' nominee2_name', ' nominee2_rel', 'nominee2_aadhno', 'centrecode', 'centrearea'];
  let app_fields = ['applicant_aadhno', 'applicant_name', 'applicant_dob', 'applicant_f_h_name', 'applicant_gender', 'applicant_marital_status', 'applicant_caste', 'applicant_pan_no', 'applicant_mobno', 'applicant_desig', 'applicant_dist', 'applicant_proj', 'applicant_sector', 'applicant_bnk_acc_no', 'applicant_ifsc_code', 'applicant_bank_name', 'applicant_branch_name', 'applicant_pmnt_details', 'applicant_dt_of_pmnt', 'applicant_utr_no', 'applicant_door_no', 'applicant_landmark', 'applicant_village_city', 'applicant_district', 'applicant_pincode', 'applicant_temp_door_no', 'applicant_temp_landmark', 'applicant_temp_village_city', 'applicant_temp_district', 'applicant_temp_pincode', 'applicant_no_of_shares', 'applicant_install_amt', 'nominee_name1', 'rel_with_memb1', 'nominee_aadhno1', 'nominee_name2', 'rel_with_memb2', 'nominee_aadhno2', 'applicant_centre_code', 'applicant_centre_area'];

// we are fetching data from server to client when the same aadhar no and mobile number matches that the client enters.
  var aadhar = req.body.aadhar;// here we are getting the value of distrivct that is enterd
  var mobile = req.body.mobile;// these are client entered values 
  let form_field = "";
  let response_obj = "";
  db_fields.map((value, index) => {
    db_fields[index] = (value).trim(); //.trim() is used to removes the space characters from start or end of a string.
  })
  console.log(aadhar + "==" + mobile);
  con.query
    ('SELECT aadharno, empname, DATE_FORMAT(dateofbirth,"%Y-%m-%d")  dateofbirth, sonof, gender,marital_status,  category, pancard,  phoneno,  designation,  districtcode, projectcode, sectorcode, bankacno, ifsccode, bankname, branchname,  pay_amt, DATE_FORMAT(pmnt_dt,"%Y-%m-%d") pmnt_dt,  utr_no,  p_ad1,  p_ad2,  p_village_city,  p_district,  p_pin,  t_ad1,  t_ad2,  t_village_city,  t_district, t_pin,  no_shares,  inst_amt,  nominee_name,  nominee_rel,   nominee_aadhno,  nominee2_name,  nominee2_rel, nominee2_aadhno, centrecode, centrearea FROM master_members where aadharno=? and phoneno=?', [aadhar, mobile],
      function (err, result, fields) {
        if (err) console.log(err);
        console.log(result);
    
        let response_obj = {};
        if ((result != undefined) && (result != null) && (result.length > 0)) {
          let json_obj = result[0];
          // console.log(json_obj);

          Object.entries(json_obj).forEach(([key, value]) => {
            // console.log(key);
            form_field = app_fields[db_fields.indexOf(key)];
            // console.log(form_field+"===="+value);
            if (form_field != undefined)
              response_obj[form_field] = value;
          })
        }
        console.log(response_obj);
 

        res.send((response_obj));
        //return res.end();
      });
  //  });
});
//end of user details

app.use('/uploads', express.static(process.cwd() + '/uploads'))
//

//end point of membership-form along with login page to membership-form.

// this is  for main admin login 
//admin_data_retrieve
app.post('/get_admin_details', function (req, res) {
  var mobile_num=req.body.mobno_key
  con.connect(function (err) { //mysql start
    if (err) console.log(err);
    con.query
      ('SELECT pwd,name FROM master_admins where mobile_no=?',[mobile_num],
      // orderby keyword sorts the order in ascending order bydefault  
      function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.send(JSON.stringify(result));
        });
  });
})
//
//admin_password_reset
app.post('/password_reset', function (req, res) {
  var mobile_num=req.body.mobile_no;
  var pwd = req.body.password;
  con.connect(function (err) { //mysql start
    if (err) console.log(err);
    con.query
      ('update master_admins set pwd=? where mobile_no=?',[pwd,mobile_num],
      // orderby keyword sorts the order in ascending order bydefault  
      function (err, result, fields) {
          if (err) throw err;
          //console.log(result);
        var json_str={msg:"Successfully reset password"};
          res.send(JSON.stringify(json_str));
        });
  });
})

//these below written data is for those whose admin got logged in and has access to the below mentioned things
//admin payment confirm
app.post('/pmnt_confirm_admin', function (req, res) {
  //var mobile_num=req.body.mobno_key
  con.connect(function (err) { //mysql start
    if (err) console.log(err);
    con.query
      ("SELECT m.aadharno,m.empname,m.phoneno,m.districtcode,d.district_desc,m.projectcode,p.project_desc,m.sectorcode,s.sector_desc,IFNULL(m.conf_flag,'N') conf_flag FROM master_members m,master_districts d,master_projects p,master_sectors s where m.districtcode=d.district_code and m.projectcode=p.project_code and p.district_code=d.district_code and s.sector_code=m.sectorcode and s.district_code=d.district_code and s.project_code=p.project_code",[],
      // orderby keyword sorts the order in ascending order bydefault  
      function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.send(JSON.stringify(result));
        });
  });
})
//
//update payment confirm
app.post('/pmnt_confirm_admin_action', function (req, res) {
  var mobile_num=req.body.mobile;
  var aadhar = req.body.aadhar;
  var admin_mobile = req.body.admin_mobile;
  con.connect(function (err) { //mysql start
    if (err) console.log(err);
    con.query
      ("update master_members set conf_flag='Y', pmnt_conf_by=? where phoneno=? and aadharno=?",[admin_mobile,mobile_num,aadhar],
      // orderby keyword sorts the order in ascending order bydefault  
      function (err, result, fields) {
          if (err) throw err;
          //console.log(result);
        var json_str={msg:"Successfully confirmed payment"};
          res.send(JSON.stringify(json_str));
        });
  });
})
// dist-wise-confirm-admin
app.post('/dist_wise_confirm_admin', function (req, res) {
  //var mobile_num=req.body.mobno_key
  con.connect(function (err) { //mysql start
    if (err) console.log(err);
    
    con.query
      ("SELECT m.aadharno,m.empname,m.phoneno,m.districtcode,d.district_desc,m.projectcode,p.project_desc,m.sectorcode,s.sector_desc,IFNULL(m.dist_conf,'N') dist_conf FROM master_members m,master_districts d,master_projects p,master_sectors s where m.districtcode=d.district_code and m.projectcode=p.project_code and p.district_code=d.district_code and s.sector_code=m.sectorcode and s.district_code=d.district_code and s.project_code=p.project_code and IFNULL(m.conf_flag,'N')<>'N'",[],
      // orderby keyword sorts the order in ascending order bydefault  
      function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.send(JSON.stringify(result));
        });
  });
})
app.post('/dist_wise_confirm_admin_action', function (req, res) {
  var mobile_num=req.body.mobile;
  var aadhar = req.body.aadhar;
  var admin_mobile = req.body.admin_mobile;
  con.connect(function (err) { //mysql start
    if (err) console.log(err);
    con.query
      ("update master_members set dist_conf='Y',dist_conf_by=? where phoneno=? and aadharno=?",[admin_mobile,mobile_num,aadhar],
      // orderby keyword sorts the order in ascending order bydefault  
      function (err, result, fields) {
          if (err) throw err;
          //console.log(result);
        var json_str={msg:"Successfully confirmed District"};
          res.send(JSON.stringify(json_str));
        });
  });
})
//
// glno generation-confirm-admin
app.post('/glno_generate_admin', function (req, res) {
  //var mobile_num=req.body.mobno_key
  con.connect(function (err) { //mysql start
    if (err) console.log(err);
    
    con.query
      ("SELECT m.aadharno,m.empname,m.phoneno,m.districtcode,d.district_desc,m.projectcode,p.project_desc,m.sectorcode,s.sector_desc,IFNULL(m.glno,'N') glno FROM master_members m,master_districts d,master_projects p,master_sectors s where m.districtcode=d.district_code and m.projectcode=p.project_code and p.district_code=d.district_code and s.sector_code=m.sectorcode and s.district_code=d.district_code and s.project_code=p.project_code and IFNULL(m.conf_flag,'N')<>'N' and IFNULL(m.dist_conf,'N')<>'N'",[],
      // orderby keyword sorts the order in ascending order bydefault  
      function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.send(JSON.stringify(result));
        });
  });
})
app.post('/glno_generate_admin_action', function (req, res) {
  var mobile_num=req.body.mobile;
  var aadhar = req.body.aadhar;
  var admin_mobile = req.body.admin_mobile;
  var glno=  Math.floor((Math.random() * 1000000) + 1).toString(); //Math.random is 0 - 0.9999999999999999. So, it generates random number between 0 1nd 1

  con.connect(function (err) { //mysql start
    if (err) console.log(err);
    con.query
      ("update master_members set glno=?,glno_appr_by=? where phoneno=? and aadharno=?",[glno,admin_mobile,mobile_num,aadhar], 
      function (err, result, fields) {
          if (err) throw err;
        var json_str={msg:"Successfully generated GL NO"+glno};
          res.send(JSON.stringify(json_str));
        });
  });
})
//
//member details fetch using from date and to date
app.post('/memb_details', function (req, res) {
  var from_date=req.body.from_dt;
  var to_date = req.body.to_dt;
  console.log(from_date+"---"+to_date); //using dateofjoin field from table, to fetch data between from and to date.
  con.connect(function (err) { 
    if (err) console.log(err);
      con.query
      ("SELECT m.aadharno,m.empname,m.phoneno,m.districtcode,d.district_desc,m.projectcode,p.project_desc,m.sectorcode,s.sector_desc,m.glno,m.conf_flag,m.dist_conf FROM master_members m,master_districts d,master_projects p,master_sectors s where m.districtcode=d.district_code and m.projectcode=p.project_code and p.district_code=d.district_code and s.sector_code=m.sectorcode and s.district_code=d.district_code and s.project_code=p.project_code and IFNULL(m.conf_flag,'N')<>'N' and IFNULL(m.dist_conf,'N')<>'N' and IFNULL(m.glno,'N')<>'N' and dateofjoin between ? and ? ",[from_date,to_date],
      // orderby keyword sorts the order in ascending order bydefault  
      function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.send(JSON.stringify(result));
        });
  });
})
//
//admin management logic
app.post('/admin_handling', function (req, res) {
  con.connect(function (err) { 
    if (err) console.log(err);
    //The LEFT JOIN keyword returns all records from the left table (table1), and the matching records from the right table (table2).
//     SELECT Customers.CustomerName, Orders.OrderID
// FROM Customers
// LEFT JOIN Orders ON Customers.CustomerID = Orders.CustomerID
// ORDER BY Customers.CustomerName;
    
    // here we are accessing three tables... master_admins,master_admin_role_matrix,master_role.. master_admins ..mobile no ands master_admin_role_matrix ..admin_mob_no when matches then left join them and if role_id is null also accept ..this complete table is again left outer join with master_roles and we are matching role_id if same in both we are doing left join and bringing the role_desc ..
    con.query
      ("select x.*,s.role_desc from (SELECT a.name,a.mobile_no,a.email_id,m.role_id,a.registered FROM `master_admins` a left outer join master_admin_role_matrix m on a.mobile_no=m.admin_mob_no ) x left outer join master_roles s  on s.role_id=x.role_id order by mobile_no",[],
      function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.send(JSON.stringify(result));
        });
  });
})
//
//admin role selection change funda
app.post('/admin_role_selection', function (req, res) {
  var mobno=req.body.mobile_no;
  var role = req.body.role_change;
  var action = req.body.action_select_remove;
  var sql_str="";
  if(action=="A"){
    sql_str="insert into master_admin_role_matrix(admin_mob_no,role_id) values (?,?)";
  }else{
    sql_str="delete from master_admin_role_matrix where admin_mob_no=? and role_id=?";
  
  }
  console.log(sql_str);
  console.log(mobno+"---"+role+"---"+action); 
      con.query
      (sql_str,[mobno,role],
      function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.send(JSON.stringify(result));
        });
})
//
//delete admin member by converting Y to N in registered field in table
app.post('/del_admin_memb', function (req, res) {
  var mobile_num=req.body.mobile_no;
  con.connect(function (err) { 
    if (err) console.log(err);
    con.query
      ("update master_admins set registered='N' where mobile_no=?",[mobile_num],
      function (err, result, fields) {
          if (err) throw err;
        var json_str={msg:"Successfully deleted admin"+mobile_num};
          res.send(JSON.stringify(json_str));
        });
  });
})
//
//restore admin whom we deleted in general admin
app.post('/restore_admin', function (req, res) {
  var mobile_num=req.body.mobile_no;
  con.connect(function (err) { 
    if (err) console.log(err);
    con.query
      ("update master_admins set registered='Y' where mobile_no=?",[mobile_num],
      function (err, result, fields) {
          if (err) throw err;
        var json_str={msg:"Successfully restored admin"+mobile_num};
          res.send(JSON.stringify(json_str));
        });
  });
})
//
//new admin selection
app.post('/new_admin_access', function (req, res) {
  var admin_name=req.body.name;
  var admin_mob_no=req.body.mobile;
  var admin_email_id=req.body.email;
  con.connect(function (err) { 
    if (err) console.log(err);
    con.query
      ("insert into master_admins(name,mobile_no,email_id,registered) values (?,?,?,'Y')",[admin_name,admin_mob_no,admin_email_id],
      function (err, result, fields) {
          if (err) throw err;
        var json_str={msg:"Successfully added admin with name "+admin_name};
          res.send(JSON.stringify(json_str));
        });
  });
})
//
// admin_role_selection
app.post('/admin_role_election', function (req, res) {
  var admin_mob_no=req.body.mobile_no;
  con.connect(function (err) { 
    if (err) console.log(err);
    con.query
      ("SELECT role_id FROM master_admin_role_matrix WHERE admin_mob_no=?",[admin_mob_no],
      function (err, result, fields) {
          if (err) throw err;
       // var json_str={msg:"Successfully added admin with name "+admin_name};
       console.log(JSON.stringify(result));
          res.send(JSON.stringify(result));
        });
  });
})
//
app.use(function (req, res, next) {
  res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080.');
});


