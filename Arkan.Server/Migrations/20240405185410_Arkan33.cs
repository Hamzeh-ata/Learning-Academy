using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Arkan.Server.Migrations
{
    public partial class Arkan33 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CoursesUnviersites_University_UniversityId",
                table: "CoursesUnviersites");

            migrationBuilder.DropPrimaryKey(
                name: "PK_University",
                table: "University");

            migrationBuilder.RenameTable(
                name: "University",
                newName: "Unviersites");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Unviersites",
                table: "Unviersites",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "StudentsPackages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    PackageId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentsPackages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentsPackages_Package_PackageId",
                        column: x => x.PackageId,
                        principalTable: "Package",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentsPackages_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudentsPackages_PackageId",
                table: "StudentsPackages",
                column: "PackageId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentsPackages_StudentId",
                table: "StudentsPackages",
                column: "StudentId");

            migrationBuilder.AddForeignKey(
                name: "FK_CoursesUnviersites_Unviersites_UniversityId",
                table: "CoursesUnviersites",
                column: "UniversityId",
                principalTable: "Unviersites",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CoursesUnviersites_Unviersites_UniversityId",
                table: "CoursesUnviersites");

            migrationBuilder.DropTable(
                name: "StudentsPackages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Unviersites",
                table: "Unviersites");

            migrationBuilder.RenameTable(
                name: "Unviersites",
                newName: "University");

            migrationBuilder.AddPrimaryKey(
                name: "PK_University",
                table: "University",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CoursesUnviersites_University_UniversityId",
                table: "CoursesUnviersites",
                column: "UniversityId",
                principalTable: "University",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
