namespace EduVision.Domain.Entities;

public sealed class School : BaseEntity
{

    public string Name { get; private set; } = string.Empty;

    public string Code { get; private set; } = string.Empty;

    private School()
    {
    }

    public static School Create(string name, string code)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(code);

        return new School
        {
            Name = name.Trim(),
            Code = code.Trim().ToUpperInvariant()
        };
    }
}
