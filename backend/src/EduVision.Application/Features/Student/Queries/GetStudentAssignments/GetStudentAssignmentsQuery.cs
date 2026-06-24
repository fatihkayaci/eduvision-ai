using MediatR;

namespace EduVision.Application.Features.Student.Queries.GetStudentAssignments;

public sealed record GetStudentAssignmentsQuery(Guid StudentId, Guid TermId) : IRequest<List<GetStudentAssignmentsResponse>>;
