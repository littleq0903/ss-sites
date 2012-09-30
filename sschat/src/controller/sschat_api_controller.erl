-module(sschat_api_controller, [Req]).
-compile(export_all).

register('GET', [API_key]) ->
    {output, "register(GET)"};
register('POST', []) ->
    New_API_key = re:replace(uuid:to_string(uuid:uuid4()), "-", "", [{return, list}, global]),
    io:format("Generated a api key: ~p, storing to database...~n", [New_API_key]),
    New_Application = apikey:new(id, New_API_key, now()), 
    case New_Application:save() of
        {ok, SavedBossRecord} -> {output, SavedBossRecord};
        {error, Msgs} -> {output, lists:nth(1, Msgs)}
    end;
register('DELETE', []) ->
    {output, "register(DELETE)"};
register('PUT', []) ->
    {output, "register(PUT)"}.

