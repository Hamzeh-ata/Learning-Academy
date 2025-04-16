using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Arkan.Server.Migrations
{
    public partial class Arkan58 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TypeId",
                table: "ArkanCodes",
                newName: "ItemId");

            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "UserCart",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Price",
                table: "UserCart",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "OrderItems",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Code",
                table: "UserCart");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "UserCart");

            migrationBuilder.DropColumn(
                name: "Code",
                table: "OrderItems");

            migrationBuilder.RenameColumn(
                name: "ItemId",
                table: "ArkanCodes",
                newName: "TypeId");
        }
    }
}
