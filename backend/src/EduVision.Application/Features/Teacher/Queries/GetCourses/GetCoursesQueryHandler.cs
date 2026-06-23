using EduVision.Application.Comman.Interfaces;
using MediatR;

namespace EduVision.Application.Features.Teacher.Queries.GetCourses;

public sealed class GetCoursesQueryHandler(ITeacherRepository teacherRepository)
    : IRequestHandler<GetCoursesQuery, List<GetCoursesResponse>>
{
    public async Task<List<GetCoursesResponse>> Handle(GetCoursesQuery request, CancellationToken cancellationToken)
    {
        var courses = await teacherRepository.GetCoursesAsync(request.TeacherId, cancellationToken);

        return courses
            .Select(cc => new GetCoursesResponse(
                cc.Id,
                cc.Course.Name,
                cc.ClassRoom.GradeLevel,
                cc.ClassRoom.Section))
            .ToList();
    }
}
