using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Arkan.Server.Migrations
{
    public partial class Arkan84 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FrequentlyAnswers");

            migrationBuilder.AddColumn<string>(
                name: "Answer",
                table: "FrequentlyQuestions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Answer",
                table: "FrequentlyQuestions");

            migrationBuilder.CreateTable(
                name: "FrequentlyAnswers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FrequentlyQuestionsId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FrequentlyAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FrequentlyAnswers_FrequentlyQuestions_FrequentlyQuestionsId",
                        column: x => x.FrequentlyQuestionsId,
                        principalTable: "FrequentlyQuestions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FrequentlyAnswers_FrequentlyQuestionsId",
                table: "FrequentlyAnswers",
                column: "FrequentlyQuestionsId");
        }
    }
}
