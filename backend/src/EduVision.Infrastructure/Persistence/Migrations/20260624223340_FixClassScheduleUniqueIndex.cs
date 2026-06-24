using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduVision.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixClassScheduleUniqueIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ClassSchedules_ClassroomCourseId_Weekday_StartTime",
                table: "ClassSchedules");

            migrationBuilder.CreateIndex(
                name: "IX_ClassSchedules_ClassroomCourseId_TermId_Weekday_StartTime",
                table: "ClassSchedules",
                columns: new[] { "ClassroomCourseId", "TermId", "Weekday", "StartTime" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ClassSchedules_ClassroomCourseId_TermId_Weekday_StartTime",
                table: "ClassSchedules");

            migrationBuilder.CreateIndex(
                name: "IX_ClassSchedules_ClassroomCourseId_Weekday_StartTime",
                table: "ClassSchedules",
                columns: new[] { "ClassroomCourseId", "Weekday", "StartTime" },
                unique: true);
        }
    }
}
