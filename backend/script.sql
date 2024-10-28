IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Clientes] (
    [ClienteId] uniqueidentifier NOT NULL,
    [Ruc] nvarchar(max) NOT NULL,
    [RazonSocial] nvarchar(max) NOT NULL,
    [Direccion] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [DeletedAt] datetime2 NULL,
    CONSTRAINT [PK_Clientes] PRIMARY KEY ([ClienteId])
);
GO

CREATE TABLE [Productos] (
    [ProductoId] uniqueidentifier NOT NULL,
    [NombreProducto] nvarchar(max) NOT NULL,
    [Descripcion] nvarchar(max) NOT NULL,
    [Precio] float NOT NULL,
    [CantidadStock] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [DeletedAt] datetime2 NULL,
    CONSTRAINT [PK_Productos] PRIMARY KEY ([ProductoId])
);
GO

CREATE TABLE [Roles] (
    [RolId] uniqueidentifier NOT NULL,
    [NombreRol] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [DeletedAt] datetime2 NULL,
    CONSTRAINT [PK_Roles] PRIMARY KEY ([RolId])
);
GO

CREATE TABLE [Usuarios] (
    [UsuarioId] uniqueidentifier NOT NULL,
    [NombreUsuario] nvarchar(max) NOT NULL,
    [Email] nvarchar(max) NOT NULL,
    [Password] nvarchar(max) NOT NULL,
    [FechaRegistro] datetime2 NOT NULL,
    [UltimoAcceso] datetime2 NULL,
    [RolId] uniqueidentifier NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [DeletedAt] datetime2 NULL,
    CONSTRAINT [PK_Usuarios] PRIMARY KEY ([UsuarioId]),
    CONSTRAINT [FK_Usuarios_Roles_RolId] FOREIGN KEY ([RolId]) REFERENCES [Roles] ([RolId]) ON DELETE NO ACTION
);
GO

CREATE TABLE [Pedidos] (
    [PedidoId] uniqueidentifier NOT NULL,
    [UsuarioId] uniqueidentifier NOT NULL,
    [ClienteId] uniqueidentifier NOT NULL,
    [FechaPedido] datetime2 NOT NULL,
    [Igv] float NOT NULL,
    [Iva] float NOT NULL,
    [Total] float NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [DeletedAt] datetime2 NULL,
    CONSTRAINT [PK_Pedidos] PRIMARY KEY ([PedidoId]),
    CONSTRAINT [FK_Pedidos_Clientes_ClienteId] FOREIGN KEY ([ClienteId]) REFERENCES [Clientes] ([ClienteId]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Pedidos_Usuarios_UsuarioId] FOREIGN KEY ([UsuarioId]) REFERENCES [Usuarios] ([UsuarioId]) ON DELETE NO ACTION
);
GO

CREATE TABLE [TokensAuth] (
    [TokenRecuperacionId] uniqueidentifier NOT NULL,
    [UsuarioId] uniqueidentifier NOT NULL,
    [Token] nvarchar(max) NOT NULL,
    [FechaGeneracion] datetime2 NOT NULL,
    [FechaExpiracion] datetime2 NOT NULL,
    [Usado] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [DeletedAt] datetime2 NULL,
    CONSTRAINT [PK_TokensAuth] PRIMARY KEY ([TokenRecuperacionId]),
    CONSTRAINT [FK_TokensAuth_Usuarios_UsuarioId] FOREIGN KEY ([UsuarioId]) REFERENCES [Usuarios] ([UsuarioId]) ON DELETE CASCADE
);
GO

CREATE TABLE [DetallePedidos] (
    [DetallePedidoId] uniqueidentifier NOT NULL,
    [ProductoId] uniqueidentifier NOT NULL,
    [PedidoId] uniqueidentifier NOT NULL,
    [Cantidad] int NOT NULL,
    [PrecioUnitario] float NOT NULL,
    [Subtotal] float NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [DeletedAt] datetime2 NULL,
    CONSTRAINT [PK_DetallePedidos] PRIMARY KEY ([DetallePedidoId]),
    CONSTRAINT [FK_DetallePedidos_Pedidos_PedidoId] FOREIGN KEY ([PedidoId]) REFERENCES [Pedidos] ([PedidoId]) ON DELETE CASCADE,
    CONSTRAINT [FK_DetallePedidos_Productos_ProductoId] FOREIGN KEY ([ProductoId]) REFERENCES [Productos] ([ProductoId]) ON DELETE NO ACTION
);
GO

CREATE INDEX [IX_DetallePedidos_PedidoId] ON [DetallePedidos] ([PedidoId]);
GO

CREATE INDEX [IX_DetallePedidos_ProductoId] ON [DetallePedidos] ([ProductoId]);
GO

CREATE INDEX [IX_Pedidos_ClienteId] ON [Pedidos] ([ClienteId]);
GO

CREATE INDEX [IX_Pedidos_UsuarioId] ON [Pedidos] ([UsuarioId]);
GO

CREATE INDEX [IX_TokensAuth_UsuarioId] ON [TokensAuth] ([UsuarioId]);
GO

CREATE INDEX [IX_Usuarios_RolId] ON [Usuarios] ([RolId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241023013639_InitialCreate', N'8.0.10');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Roles] ADD [AccesoTotal] int NOT NULL DEFAULT 0;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241023162901_PermisosRol', N'8.0.10');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [EstadoPedidos] (
    [EstadoPedidoId] uniqueidentifier NOT NULL,
    [NombreEstadoPedido] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [DeletedAt] datetime2 NULL,
    CONSTRAINT [PK_EstadoPedidos] PRIMARY KEY ([EstadoPedidoId])
);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241025204157_EstadoPedido', N'8.0.10');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Pedidos] ADD [EstadoPedidoId] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
GO

CREATE INDEX [IX_Pedidos_EstadoPedidoId] ON [Pedidos] ([EstadoPedidoId]);
GO

ALTER TABLE [Pedidos] ADD CONSTRAINT [FK_Pedidos_EstadoPedidos_EstadoPedidoId] FOREIGN KEY ([EstadoPedidoId]) REFERENCES [EstadoPedidos] ([EstadoPedidoId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241025211025_RelacionEstadoPedido', N'8.0.10');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241025220930_DetallePedidos', N'8.0.10');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Usuarios] ADD [Apellido] nvarchar(max) NOT NULL DEFAULT N'';
GO

ALTER TABLE [Usuarios] ADD [Nombre] nvarchar(max) NOT NULL DEFAULT N'';
GO

ALTER TABLE [Pedidos] ADD [SeriePedido] nvarchar(max) NOT NULL DEFAULT N'';
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241027164647_DatosUsuario', N'8.0.10');
GO

COMMIT;
GO

