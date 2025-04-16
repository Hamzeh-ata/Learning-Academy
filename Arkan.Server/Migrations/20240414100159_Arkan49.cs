using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Arkan.Server.Migrations
{
    public partial class Arkan49 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quiz_Lessons_LessonId1",
                table: "Quiz");

            migrationBuilder.DropIndex(
                name: "IX_Quiz_LessonId1",
                table: "Quiz");

            migrationBuilder.DropColumn(
                name: "LessonId1",
                table: "Quiz");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LessonId1",
                table: "Quiz",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Quiz_LessonId1",
                table: "Quiz",
                column: "LessonId1",
                unique: true,
                filter: "[LessonId1] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Quiz_Lessons_LessonId1",
                table: "Quiz",
                column: "LessonId1",
                principalTable: "Lessons",
                principalColumn: "Id");
        }
    }
}
