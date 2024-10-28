using backend.Helper;
using MediatR;

namespace backend.Application.Queries.ClienteQuery.ListarClientesCombo
{
    public class ListarClienteComboQuery : IRequest<List<ComboBase>>
    {
        public string? Empresa {  get; set; }
    }
}
