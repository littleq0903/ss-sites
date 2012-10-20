-module(sschat_api_controller, [Req]).
-compile(export_all).

get_uuid_id(apikey) ->
    "apikey_" ++ get_uuid_id();
get_uuid_id(room) ->
    "room_" ++ get_uuid_id();
get_uuid_id(user) ->
    "user_" ++ get_uuid_id().
get_uuid_id() ->
    re:replace(uuid:to_string(uuid:uuid4()), "-", "", [global, {return, list}]).

check_apikey(ApikeyFromReq) ->
    Count = boss_db:count(apikey, [id, 'equals', ApikeyFromReq]),
    case Count of
        0 -> false;
        _ -> true
    end.

% register apis
register('GET', [API_key]) ->
    Count = boss_db:count(apikey, [id, 'equals', API_key]),
    case Count of
        0 -> not_found;
        Otherwise -> {json, [{status, "ok"}]}
    end;
register('POST', []) ->
    New_API_key = get_uuid_id(apikey),
    io:format("Generated a api key: ~p, storing to database...~n", [New_API_key]),
    New_Application = apikey:new(New_API_key), 
    case New_Application:save() of
        {ok, SavedBossRecord} -> {json, [{status, "ok"}]};
        {error, Msgs} -> {output, lists:nth(1, Msgs)}
    end;
register('DELETE', [API_key]) ->
    Result = boss_db:delete(API_key),
    io:format("Received deleting api key action, deleting api key: ~p~n", [API_key]),
    case Result of
        ok -> {json, [{status, "ok"}]};
        {error, Reason} -> {json, [
                    {status, "error"},
                    {reason, Reason}
                    ]}
    end.

% rooms apis

room('GET', [RoomId]) ->
    Apikey = Req:query_param("apikey"),
    case check_apikey(Apikey) of
        false -> {unauthorized, "api key not found."};
        true -> {output, "not implemented yet."}
    end;
room('POST', []) ->
    Apikey = Req:post_params("apikey"),

    case check_apikey(Apikey) of
        false -> {unauthorized, "api key not found."};
        true -> 
            RoomId = get_uuid_id(room),
            io:format("Received request to create a room, assigned room id: ~p~n", [RoomId]),
            {output, "not implemented yet."}
    end;
room('DELETE', [RoomId]) ->
    Apikey = Req:post_params("apikey"),
    case check_apikey(Apikey) of
        false -> {unauthorized, "api key not found."};
        true -> {output, "not implemented yet."}
    end;
room('PUT', [RoomId]) ->
    Apikey = Req:post_params("apikey"),
    case check_apikey(Apikey) of
        false -> {unauthorized, "api key not found."};
        true -> {output, "not implemented yet."}
    end.


% users apis
user('GET', []) ->
    Apikey = Req:query_params("apikey"),
    case check_apikey(Apikey) of
        false -> {unauthorized, "api key not found."};
        true -> {output, "not implemented yet."}
    end;
user('POST', []) ->
    Apikey = Req:post_params("apikey"),
    case check_apikey(Apikey) of
        false -> {unauthorized, "api key not found."};
        true -> {output, "not implemented yet."}
    end;
user('DELETE', []) ->
    Apikey = Req:post_params("apikey"),
    case check_apikey(Apikey) of
        false -> {unauthorized, "api key not found."};
        true -> {output, "not implemented yet."}
    end.
