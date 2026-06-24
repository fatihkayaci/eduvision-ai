using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduVision.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddTerm : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TermId",
                table: "Grades",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "TermId",
                table: "ClassSchedules",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "TermId",
                table: "Attendances",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "TermId",
                table: "Assignments",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "Terms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SchoolId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Terms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Terms_Schools_SchoolId",
                        column: x => x.SchoolId,
                        principalTable: "Schools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Grades_TermId",
                table: "Grades",
                column: "TermId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassSchedules_TermId",
                table: "ClassSchedules",
                column: "TermId");

            migrationBuilder.CreateIndex(
                name: "IX_Attendances_TermId",
                table: "Attendances",
                column: "TermId");

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_TermId",
                table: "Assignments",
                column: "TermId");

            migrationBuilder.CreateIndex(
                name: "IX_Terms_SchoolId_Name_Year",
                table: "Terms",
                columns: new[] { "SchoolId", "Name", "Year" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Assignments_Terms_TermId",
                table: "Assignments",
                column: "TermId",
                principalTable: "Terms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Attendances_Terms_TermId",
                table: "Attendances",
                column: "TermId",
                principalTable: "Terms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ClassSchedules_Terms_TermId",
                table: "ClassSchedules",
                column: "TermId",
                principalTable: "Terms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Grades_Terms_TermId",
                table: "Grades",
                column: "TermId",
                principalTable: "Terms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Assignments_Terms_TermId",
                table: "Assignments");

            migrationBuilder.DropForeignKey(
                name: "FK_Attendances_Terms_TermId",
                table: "Attendances");

            migrationBuilder.DropForeignKey(
                name: "FK_ClassSchedules_Terms_TermId",
                table: "ClassSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_Grades_Terms_TermId",
                table: "Grades");

            migrationBuilder.DropTable(
                name: "Terms");

            migrationBuilder.DropIndex(
                name: "IX_Grades_TermId",
                table: "Grades");

            migrationBuilder.DropIndex(
                name: "IX_ClassSchedules_TermId",
                table: "ClassSchedules");

            migrationBuilder.DropIndex(
                name: "IX_Attendances_TermId",
                table: "Attendances");

            migrationBuilder.DropIndex(
                name: "IX_Assignments_TermId",
                table: "Assignments");

            migrationBuilder.DropColumn(
                name: "TermId",
                table: "Grades");

            migrationBuilder.DropColumn(
                name: "TermId",
                table: "ClassSchedules");

            migrationBuilder.DropColumn(
                name: "TermId",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "TermId",
                table: "Assignments");
        }
    }
}
