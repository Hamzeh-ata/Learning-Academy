using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Arkan.Server.Migrations
{
    public partial class Arkan76 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CoursesMessagesReactions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CoursesRoomMessagesId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Emoji = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoursesMessagesReactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoursesMessagesReactions_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoursesMessagesReactions_CoursesRoomMessages_CoursesRoomMessagesId",
                        column: x => x.CoursesRoomMessagesId,
                        principalTable: "CoursesRoomMessages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserSeenMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoomId = table.Column<int>(type: "int", nullable: false),
                    LastMessageId = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    SeenAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSeenMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserSeenMessages_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CoursesMessagesReactions_CoursesRoomMessagesId",
                table: "CoursesMessagesReactions",
                column: "CoursesRoomMessagesId");

            migrationBuilder.CreateIndex(
                name: "IX_CoursesMessagesReactions_UserId",
                table: "CoursesMessagesReactions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserSeenMessages_UserId",
                table: "UserSeenMessages",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CoursesMessagesReactions");

            migrationBuilder.DropTable(
                name: "UserSeenMessages");
        }
    }
}
