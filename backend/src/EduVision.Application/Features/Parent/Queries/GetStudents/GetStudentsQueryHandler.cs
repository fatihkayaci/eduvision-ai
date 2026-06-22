using EduVision.Application.Comman.Interfaces;
using MediatR;

namespace EduVision.Application.Features.Parent.Queries.GetStudents;

public sealed class GetStudentsQueryHandler(IParentRepository parentRepository)
    : IRequestHandler<GetStudentsQuery, List<GetStudentsResponse>>
{
    public async Task<List<GetStudentsResponse>> Handle(GetStudentsQuery request, CancellationToken cancellationToken)
    {
        var studentParents = await parentRepository.GetStudentsAsync(request.ParentId, cancellationToken);

        return studentParents
            .Select(sp => new GetStudentsResponse(
                sp.StudentId,
                sp.Student.FirstName,
                sp.Student.LastName))
            .ToList();
    }
}
