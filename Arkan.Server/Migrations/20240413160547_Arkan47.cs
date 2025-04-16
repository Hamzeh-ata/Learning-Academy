using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Arkan.Server.Migrations
{
    public partial class Arkan47 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Duration",
                table: "Lessons",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Material",
                table: "Lessons",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "Material",
                table: "Lessons");
        }
    }
}
