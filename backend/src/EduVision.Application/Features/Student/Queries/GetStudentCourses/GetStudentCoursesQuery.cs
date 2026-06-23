using MediatR;

namespace EduVision.Application.Features.Student.Queries.GetStudentCourses;

public sealed record GetStudentCoursesQuery(Guid StudentId) : IRequest<List<GetStudentCoursesResponse>>;
