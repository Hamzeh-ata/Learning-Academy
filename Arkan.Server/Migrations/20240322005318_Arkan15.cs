using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Arkan.Server.Migrations
{
    public partial class Arkan15 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "PagePermissions",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_PagePermissions_UserId",
                table: "PagePermissions",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_PagePermissions_AspNetUsers_UserId",
                table: "PagePermissions",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PagePermissions_AspNetUsers_UserId",
                table: "PagePermissions");

            migrationBuilder.DropIndex(
                name: "IX_PagePermissions_UserId",
                table: "PagePermissions");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "PagePermissions");
        }
    }
}
