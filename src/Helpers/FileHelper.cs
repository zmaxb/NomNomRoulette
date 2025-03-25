using System.Text;
using System.Text.Json;

namespace NomNomRoulette.Helpers;

public static class FileHelper
{
    public static bool TryReadJson(string path, out string content)
    {
        content = string.Empty;
        try
        {
            if (!File.Exists(path)) return false;
            content = File.ReadAllText(path);
            return true;
        }
        catch(Exception ex)
        {
            Console.WriteLine(ex.Message);
            return false;
        }
    }

    public static bool TryWriteJson(string path, JsonElement json)
    {
        try
        {
            File.WriteAllText(path, json.ToString(), Encoding.UTF8);
            return true;
        }
        catch(Exception ex)
        {
            Console.WriteLine(ex.Message);
            return false;
        }
    }
}