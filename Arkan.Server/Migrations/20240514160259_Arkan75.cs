using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Arkan.Server.Migrations
{
    public partial class Arkan75 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CoursesChatMutedStudents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CourseId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoursesChatMutedStudents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoursesChatMutedStudents_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoursesChatMutedStudents_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CoursesChatRooms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CourseId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoursesChatRooms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoursesChatRooms_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CoursesRoomMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CoursesChatRoomsId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    ParentMessageID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoursesRoomMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoursesRoomMessages_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoursesRoomMessages_CoursesChatRooms_CoursesChatRoomsId",
                        column: x => x.CoursesChatRoomsId,
                        principalTable: "CoursesChatRooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoursesRoomMessages_CoursesRoomMessages_ParentMessageID",
                        column: x => x.ParentMessageID,
                        principalTable: "CoursesRoomMessages",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_CoursesChatMutedStudents_CourseId",
                table: "CoursesChatMutedStudents",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_CoursesChatMutedStudents_UserId",
                table: "CoursesChatMutedStudents",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_CoursesChatRooms_CourseId",
                table: "CoursesChatRooms",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_CoursesRoomMessages_CoursesChatRoomsId",
                table: "CoursesRoomMessages",
                column: "CoursesChatRoomsId");

            migrationBuilder.CreateIndex(
                name: "IX_CoursesRoomMessages_ParentMessageID",
                table: "CoursesRoomMessages",
                column: "ParentMessageID");

            migrationBuilder.CreateIndex(
                name: "IX_CoursesRoomMessages_UserId",
                table: "CoursesRoomMessages",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CoursesChatMutedStudents");

            migrationBuilder.DropTable(
                name: "CoursesRoomMessages");

            migrationBuilder.DropTable(
                name: "CoursesChatRooms");
        }
    }
}
