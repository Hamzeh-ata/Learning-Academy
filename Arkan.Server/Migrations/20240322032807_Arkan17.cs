using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Arkan.Server.Migrations
{
    public partial class Arkan17 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UsersRoles_Role_RolesId",
                table: "UsersRoles");

            migrationBuilder.RenameColumn(
                name: "RolesId",
                table: "UsersRoles",
                newName: "RoleId");

            migrationBuilder.RenameIndex(
                name: "IX_UsersRoles_RolesId",
                table: "UsersRoles",
                newName: "IX_UsersRoles_RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_PagePermissions_RoleId",
                table: "PagePermissions",
                column: "RoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_PagePermissions_Role_RoleId",
                table: "PagePermissions",
                column: "RoleId",
                principalTable: "Role",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UsersRoles_Role_RoleId",
                table: "UsersRoles",
                column: "RoleId",
                principalTable: "Role",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PagePermissions_Role_RoleId",
                table: "PagePermissions");

            migrationBuilder.DropForeignKey(
                name: "FK_UsersRoles_Role_RoleId",
                table: "UsersRoles");

            migrationBuilder.DropIndex(
                name: "IX_PagePermissions_RoleId",
                table: "PagePermissions");

            migrationBuilder.RenameColumn(
                name: "RoleId",
                table: "UsersRoles",
                newName: "RolesId");

            migrationBuilder.RenameIndex(
                name: "IX_UsersRoles_RoleId",
                table: "UsersRoles",
                newName: "IX_UsersRoles_RolesId");

            migrationBuilder.AddForeignKey(
                name: "FK_UsersRoles_Role_RolesId",
                table: "UsersRoles",
                column: "RolesId",
                principalTable: "Role",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
