using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Arkan.Server.Migrations
{
    public partial class Arkan86 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserQuizAttempt_Quiz_QuizId",
                table: "UserQuizAttempt");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "UserQuizAttempt",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddForeignKey(
                name: "FK_UserQuizAttempt_Quiz_QuizId",
                table: "UserQuizAttempt",
                column: "QuizId",
                principalTable: "Quiz",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserQuizAttempt_Quiz_QuizId",
                table: "UserQuizAttempt");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "UserQuizAttempt",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_UserQuizAttempt_Quiz_QuizId",
                table: "UserQuizAttempt",
                column: "QuizId",
                principalTable: "Quiz",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
