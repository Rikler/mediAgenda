import { TestBed } from '@angular/core/testing';

import { MediAgendaService } from './medi-agenda.service';

describe('MediAgendaService', () => {
  let service: MediAgendaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediAgendaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
