using EduVision.Application.Comman.Interfaces;
using MediatR;

namespace EduVision.Application.Features.Teacher.Queries.GetClassStudents;

public sealed class GetClassStudentsQueryHandler(ITeacherRepository teacherRepository)
    : IRequestHandler<GetClassStudentsQuery, List<GetClassStudentsResponse>>
{
    public async Task<List<GetClassStudentsResponse>> Handle(GetClassStudentsQuery request, CancellationToken cancellationToken)
    {
        var students = await teacherRepository.GetClassStudentsAsync(request.ClassroomCourseId, cancellationToken);

        return students
            .Select(sp => new GetClassStudentsResponse(
                sp.UserId,
                sp.User.FirstName,
                sp.User.LastName,
                sp.StudentNumber))
            .ToList();
    }
}
