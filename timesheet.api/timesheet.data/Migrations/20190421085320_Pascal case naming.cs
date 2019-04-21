using Microsoft.EntityFrameworkCore.Migrations;

namespace timesheet.data.Migrations
{
    public partial class Pascalcasenaming : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Efforts_Employees_employeeId",
                table: "Efforts");

            migrationBuilder.DropForeignKey(
                name: "FK_Efforts_Tasks_taskId",
                table: "Efforts");

            migrationBuilder.RenameColumn(
                name: "taskId",
                table: "Efforts",
                newName: "TaskId");

            migrationBuilder.RenameColumn(
                name: "hours",
                table: "Efforts",
                newName: "Hours");

            migrationBuilder.RenameColumn(
                name: "employeeId",
                table: "Efforts",
                newName: "EmployeeId");

            migrationBuilder.RenameIndex(
                name: "IX_Efforts_taskId",
                table: "Efforts",
                newName: "IX_Efforts_TaskId");

            migrationBuilder.RenameIndex(
                name: "IX_Efforts_employeeId",
                table: "Efforts",
                newName: "IX_Efforts_EmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Efforts_Employees_EmployeeId",
                table: "Efforts",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Efforts_Tasks_TaskId",
                table: "Efforts",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Efforts_Employees_EmployeeId",
                table: "Efforts");

            migrationBuilder.DropForeignKey(
                name: "FK_Efforts_Tasks_TaskId",
                table: "Efforts");

            migrationBuilder.RenameColumn(
                name: "TaskId",
                table: "Efforts",
                newName: "taskId");

            migrationBuilder.RenameColumn(
                name: "Hours",
                table: "Efforts",
                newName: "hours");

            migrationBuilder.RenameColumn(
                name: "EmployeeId",
                table: "Efforts",
                newName: "employeeId");

            migrationBuilder.RenameIndex(
                name: "IX_Efforts_TaskId",
                table: "Efforts",
                newName: "IX_Efforts_taskId");

            migrationBuilder.RenameIndex(
                name: "IX_Efforts_EmployeeId",
                table: "Efforts",
                newName: "IX_Efforts_employeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Efforts_Employees_employeeId",
                table: "Efforts",
                column: "employeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Efforts_Tasks_taskId",
                table: "Efforts",
                column: "taskId",
                principalTable: "Tasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
