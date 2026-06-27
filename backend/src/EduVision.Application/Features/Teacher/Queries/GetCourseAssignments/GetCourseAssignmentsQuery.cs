using MediatR;

namespace EduVision.Application.Features.Teacher.Queries.GetCourseAssignments;

public sealed record GetCourseAssignmentsQuery(Guid ClassroomCourseId, Guid TermId) : IRequest<List<GetCourseAssignmentsResponse>>;
