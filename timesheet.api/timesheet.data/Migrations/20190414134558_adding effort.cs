using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace timesheet.data.Migrations
{
    public partial class addingeffort : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Employees",
                maxLength: 260,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 255);

            migrationBuilder.CreateTable(
                name: "Efforts",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Date = table.Column<long>(nullable: false),
                    hours = table.Column<int>(nullable: false),
                    taskId = table.Column<int>(nullable: false),
                    employeeId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Efforts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Efforts_Employees_employeeId",
                        column: x => x.employeeId,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Efforts_Tasks_taskId",
                        column: x => x.taskId,
                        principalTable: "Tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Efforts_employeeId",
                table: "Efforts",
                column: "employeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Efforts_taskId",
                table: "Efforts",
                column: "taskId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Efforts");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Employees",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 260);
        }
    }
}
