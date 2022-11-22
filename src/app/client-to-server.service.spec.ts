import { TestBed } from '@angular/core/testing';

import { ClientToServerService } from './client-to-server.service';

describe('ClientToServerService', () => {
  let service: ClientToServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientToServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
