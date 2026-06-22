using MediatR;

namespace EduVision.Application.Features.Parent.Queries.GetStudents;

public sealed record GetStudentsQuery(Guid ParentId) : IRequest<List<GetStudentsResponse>>;
