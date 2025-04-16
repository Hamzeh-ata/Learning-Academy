using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Arkan.Server.Migrations
{
    public partial class Arkan81 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "LiveSessions",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "LiveSessions");
        }
    }
}
