using MediatR;

namespace EduVision.Application.Features.Teacher.Queries.GetClassStudents;

public sealed record GetClassStudentsQuery(Guid ClassroomCourseId) : IRequest<List<GetClassStudentsResponse>>;
