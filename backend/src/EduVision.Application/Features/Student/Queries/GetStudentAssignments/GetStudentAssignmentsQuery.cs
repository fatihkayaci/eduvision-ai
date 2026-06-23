using MediatR;

namespace EduVision.Application.Features.Student.Queries.GetStudentAssignments;

public sealed record GetStudentAssignmentsQuery(Guid StudentId) : IRequest<List<GetStudentAssignmentsResponse>>;
