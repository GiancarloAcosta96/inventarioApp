using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RelacionEstadoPedido : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "EstadoPedidoId",
                table: "Pedidos",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Pedidos_EstadoPedidoId",
                table: "Pedidos",
                column: "EstadoPedidoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Pedidos_EstadoPedidos_EstadoPedidoId",
                table: "Pedidos",
                column: "EstadoPedidoId",
                principalTable: "EstadoPedidos",
                principalColumn: "EstadoPedidoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pedidos_EstadoPedidos_EstadoPedidoId",
                table: "Pedidos");

            migrationBuilder.DropIndex(
                name: "IX_Pedidos_EstadoPedidoId",
                table: "Pedidos");

            migrationBuilder.DropColumn(
                name: "EstadoPedidoId",
                table: "Pedidos");
        }
    }
}
