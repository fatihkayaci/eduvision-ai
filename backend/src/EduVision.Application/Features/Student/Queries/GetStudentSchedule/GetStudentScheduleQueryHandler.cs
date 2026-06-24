using EduVision.Application.Comman.Interfaces;
using MediatR;

namespace EduVision.Application.Features.Student.Queries.GetStudentSchedule;

public sealed class GetStudentScheduleQueryHandler(IStudentRepository studentRepository)
    : IRequestHandler<GetStudentScheduleQuery, List<GetStudentScheduleResponse>>
{
    public async Task<List<GetStudentScheduleResponse>> Handle(GetStudentScheduleQuery request, CancellationToken cancellationToken)
    {
        var schedule = await studentRepository.GetScheduleAsync(request.StudentId, request.TermId, cancellationToken);

        return schedule
            .Select(cs => new GetStudentScheduleResponse(
                cs.ClassroomCourse.Course.Name,
                cs.Weekday.ToString(),
                cs.StartTime,
                cs.EndTime))
            .ToList();
    }
}
