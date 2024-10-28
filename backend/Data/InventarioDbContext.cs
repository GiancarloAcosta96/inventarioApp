using backend.Models.ClienteEntity;
using backend.Models.PedidoEntity;
using backend.Models.ProductoEntity;
using backend.Models.RolEntity;
using backend.Models.TokensAuthEntity;
using backend.Models.UsuarioEntity;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class InventarioDbContext: DbContext
    {
        public InventarioDbContext(DbContextOptions<InventarioDbContext> options) : base(options) 
        {
        }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Rol> Roles { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<DetallePedido> DetallePedidos { get; set; }
        public DbSet<TokensAuth> TokensAuth { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<EstadoPedido> EstadoPedidos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(e => e.UsuarioId);
                entity.HasOne(e => e.Rol)
                      .WithMany()
                      .HasForeignKey(e => e.RolId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<TokensAuth>(entity =>
            {
                entity.HasKey(e => e.TokenRecuperacionId);
                entity.HasOne<Usuario>()
                      .WithMany()
                      .HasForeignKey(e => e.UsuarioId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Rol>(entity =>
            {
                entity.HasKey(e => e.RolId);
            });

            modelBuilder.Entity<Producto>(entity =>
            {
                entity.HasKey(e => e.ProductoId);
            });

            modelBuilder.Entity<EstadoPedido>(entity =>
            {
                entity.HasKey(e => e.EstadoPedidoId);
            });

            modelBuilder.Entity<Pedido>(entity =>
            {
                entity.HasKey(e => e.PedidoId);

                entity.HasOne(e => e.Usuario)
                      .WithMany()
                      .HasForeignKey(e => e.UsuarioId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Cliente)
                      .WithMany()
                      .HasForeignKey(e => e.ClienteId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.EstadoPedido)
                    .WithMany()
                    .HasForeignKey(e => e.EstadoPedidoId)
                    .OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<DetallePedido>(entity =>
            {
                entity.HasKey(e => e.DetallePedidoId);

                entity.HasOne(e => e.Producto)
                      .WithMany()
                      .HasForeignKey(e => e.ProductoId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Pedido)
                      .WithMany(p => p.DetallePedidos)
                      .HasForeignKey(e => e.PedidoId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Cliente>(entity =>
            {
                entity.HasKey(e => e.ClienteId);
            });

            modelBuilder.Entity<Usuario>().Property(e => e.CreatedAt).IsRequired();
            modelBuilder.Entity<Producto>().Property(e => e.CreatedAt).IsRequired();
            modelBuilder.Entity<Pedido>().Property(e => e.CreatedAt).IsRequired();
            modelBuilder.Entity<DetallePedido>().Property(e => e.CreatedAt).IsRequired();
            modelBuilder.Entity<Cliente>().Property(e => e.CreatedAt).IsRequired();
            modelBuilder.Entity<Rol>().Property(e => e.CreatedAt).IsRequired();
            modelBuilder.Entity<EstadoPedido>().Property(e => e.CreatedAt).IsRequired();
        }
    }
}
