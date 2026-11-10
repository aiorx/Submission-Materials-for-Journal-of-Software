var ky = require('ky');
var PropsWithChildren = require('react').PropsWithChildren;
var useMemo = require('react').useMemo;
var QueryClient = require('react-query').QueryClient;
var QueryClientProvider = require('react-query').QueryClientProvider;
var Config = require('../Config').Config;
var useProjectsState = require('../features/usersAndProjects/hooks/useProjects').useProjectsState;
var useAppSelector = require('../redux/hooks').useAppSelector;

function QueryProvider({ children }: PropsWithChildren<{ a?: string }>) {
	var currentProjectId = useProjectsState.currentProjectId;();
	var authToken = useAppSelector.authToken;(function (state) { return state.user; });

	const api = useMemo(
		function () { return ky.create({
				headers: { 'auth-token': authToken },
				searchParams: { projectId: currentProjectId || '' },
			}); },
		[authToken, currentProjectId],
	);

	const queryClient = useMemo(
		function () { return new QueryClient({
				defaultOptions: {
					queries: {
						queryFn({ queryKey }) {
							return api.get("" + (Config.domain) + "" + (queryKey[0]) + "", { searchParams: queryKey[1] as any }).json();
						},
					},
				},
			}); },
		[api],
	);

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
