using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Arkan.Server.Migrations
{
    public partial class Arkan46 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "showStudentsCount",
                table: "Instructors",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "showStudentsCount",
                table: "Instructors");
        }
    }
}
