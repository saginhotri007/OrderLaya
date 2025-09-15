using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

namespace FoodDeliveryAPI.Clients
{
    public class WhatsAppMessage
    {
        public string To { get; set; }
        public string Body { get; set; }
    }

    public class TwilioWhatsAppClient
    {
        private readonly string _accountSid;
        private readonly string _authToken;
        private readonly string _fromNumber;

        public TwilioWhatsAppClient(string accountSid, string authToken, string fromNumber)
        {
            _accountSid = accountSid;
            _authToken = authToken;
            _fromNumber = fromNumber;
        }

        public async Task SendMessageAsync(string toNumber, string messageBody)
        {
            var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(Encoding.ASCII.GetBytes($"{_accountSid}:{_authToken}")));

            var message = new WhatsAppMessage
            {
                To = toNumber,
                Body = messageBody
            };

            var json = JsonConvert.SerializeObject(message);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await client.PostAsync($"https://api.twilio.com/2010-04-01/Accounts/{_accountSid}/Messages.json", content);
            response.EnsureSuccessStatusCode();
        }
    }
}
