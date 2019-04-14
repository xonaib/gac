import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-tasks',
  templateUrl: './employee-tasks.component.html',
  styleUrls: ['./employee-tasks.component.scss']
})
export class EmployeeTasksComponent implements OnInit {
  empId: number;

  constructor(private employeeService: EmployeeService, private route: ActivatedRoute) { }
  
  ngOnInit() {
    this.empId = this.route.snapshot.paramMap.get('id') != null ? Number(this.route.snapshot.paramMap.get('id')) : 0;


  }

}
