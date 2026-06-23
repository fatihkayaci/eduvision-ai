using MediatR;

namespace EduVision.Application.Features.Teacher.Queries.GetCourses;

public sealed record GetCoursesQuery(Guid TeacherId) : IRequest<List<GetCoursesResponse>>;
