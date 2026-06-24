using EduVision.Application.Comman.Interfaces;
using MediatR;

namespace EduVision.Application.Features.Student.Queries.GetStudentCourses;

public sealed class GetStudentCoursesQueryHandler(IStudentRepository studentRepository)
    : IRequestHandler<GetStudentCoursesQuery, List<GetStudentCoursesResponse>>
{
    public async Task<List<GetStudentCoursesResponse>> Handle(GetStudentCoursesQuery request, CancellationToken cancellationToken)
    {
        var courses = await studentRepository.GetCoursesWithGradesAsync(request.StudentId, request.TermId, cancellationToken);

        return courses
            .Select(cc => new GetStudentCoursesResponse(
                cc.Id,
                cc.Course.Name,
                cc.Grades
                    .Select(g => new GradeResponse(g.Value, g.ExamType.ToString(), g.Date))
                    .ToList()))
            .ToList();
    }
}
