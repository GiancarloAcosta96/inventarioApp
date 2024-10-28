namespace backend.Models.TokensAuthEntity
{
    public class TokensAuth: EntityBase
    {
        public Guid TokenRecuperacionId { get; set; }
        public Guid UsuarioId { get; set; }
        public string Token {  get; set; }
        public DateTime FechaGeneracion { get; set; }
        public DateTime FechaExpiracion { get; set; }
        public Boolean Usado {  get; set; }
    }
}
