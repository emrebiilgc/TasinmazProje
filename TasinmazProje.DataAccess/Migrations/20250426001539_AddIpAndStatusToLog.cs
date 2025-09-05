using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TasinmazProje.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddIpAndStatusToLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IpAddress",
                table: "Logs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "Status",
                table: "Logs",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IpAddress",
                table: "Logs");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Logs");
        }
    }
}
