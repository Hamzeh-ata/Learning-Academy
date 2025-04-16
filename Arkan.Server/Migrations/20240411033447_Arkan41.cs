using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Arkan.Server.Migrations
{
    public partial class Arkan41 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "OverViewUrl",
                table: "Courses",
                newName: "VideoOverView");

            migrationBuilder.AddColumn<string>(
                name: "CourseImageOverView",
                table: "Quiz",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CourseVideoOverView",
                table: "Quiz",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OverViewImage",
                table: "Courses",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CourseImageOverView",
                table: "Quiz");

            migrationBuilder.DropColumn(
                name: "CourseVideoOverView",
                table: "Quiz");

            migrationBuilder.DropColumn(
                name: "OverViewImage",
                table: "Courses");

            migrationBuilder.RenameColumn(
                name: "VideoOverView",
                table: "Courses",
                newName: "OverViewUrl");
        }
    }
}
