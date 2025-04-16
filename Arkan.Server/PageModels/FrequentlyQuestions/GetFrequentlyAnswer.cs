namespace Arkan.Server.PageModels.FrequentlyQuestions
{
    public class GetFrequentlyAnswer
    {
        public int Id { get; set; }
        public string Answer {  get; set; }
        public int QuestionId { get; set; }
        public string Key { get; set; }
    }
}
