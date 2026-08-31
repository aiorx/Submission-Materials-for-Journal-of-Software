```python
def load_all_results_from_wadb(all_objectives, env_name=None):        
    all_results = pd.DataFrame()
    avg_reward_over_time = pd.DataFrame()

    for _, reward_type in enumerate(all_objectives):
        models_to_plot = pd.DataFrame(reward_type['models'])

        results_by_reward_type = {}
        for i, model_name in enumerate(models_to_plot['name'].unique()):
            models = models_to_plot[models_to_plot['name'] == model_name].to_dict('records')
            if len(models[0]['run_ids']) < REQ_SEEDS:
                print(f"!WARNING! {reward_type['reward_type']} reward type, {model_name} does not have enough seeds (has {len(models[0]['run_ids'])}, while {REQ_SEEDS} are required)")

            avg_rewards_by_seed = []
            for j, model in enumerate(models):
                print(f"Processing {env_name} {model_name} ({reward_type['reward_type']}) - {model['run_ids']}")
                # Read the content of the output file
                results_by_reward_type[model_name] = {'average_test_reward': []}
                for i in range(len(model['run_ids'])):
                    if model['run_ids'][i] == '':
                        print(f"WARNING - Empty run id in {model_name}")
                        continue
                    
                    if model_name == 'DeepRL' or model_name == 'TabularMNEP':
                        project_name = "TNDP-RL"
                    elif model_name == 'GA':
                        project_name = "TNDP-GA"
                    elif model_name == 'GS':
                        project_name = "TNDP-GS"
                    
                    run = api.run(f"{project_name}/{model['run_ids'][i]}")
                    
                    if model_name not in ['GA', 'GS']:
                        results_by_reward_type[model_name]['average_test_reward'].append(run.summary['Average-Test-Reward'])
                    else:
                        results_by_reward_type[model_name]['average_test_reward'].append(run.summary['average_reward'])

                    if model_name != 'DeepRL':
                        keys_to_load = ['episode', 'average_reward'] if model_name != 'GA' else ['generation', 'average_reward']
                        history = []
                        for row in run.scan_history(keys=keys_to_load):
                            history.append(row)

                        # Convert to DataFrame
                        history = pd.DataFrame(history)
                        rewards = history[history['average_reward'] > 0]['average_reward'].tolist()
                        
                        if len(rewards) > 0:
                            avg_rewards_by_seed.append(rewards)
                        else:
                            print(f"WARNING - No average_reward values in {model_name}, {reward_type} - {model['run_ids'][i]}")
                    else:
                        rewards = []
                        

            model_name_adj = model_name.replace(f'-{env_name}', '')
            if len(avg_rewards_by_seed) > 0:
                averages, ci_upper, ci_lower = average_per_step(avg_rewards_by_seed)
                
                avg_reward_over_time = pd.concat([avg_reward_over_time, 
                                                  pd.DataFrame({f"{model_name_adj}_{reward_type['reward_type']}": averages,
                                                                f"{model_name_adj}_{reward_type['reward_type']}_upper": ci_upper,
                                                                f"{model_name_adj}_{reward_type['reward_type']}_lower": ci_lower})])
            
        # Quite a hacky way to get the results in a dataframe, but didn't have time to do it properly (thanks copilot)
        # Convert all_results to a dataframe, with columns 'model', 'metric', 'value', and each row is a different value and not a list
        # results_by_objective = pd.DataFrame([(name, metric, value) for name in results_by_objective.keys() for metric in results_by_objective[name].keys() for value in results_by_objective[name][metric]], columns=['model', 'metric', 'value'])
        # Convert all_results to a dataframe, with columns 'model', 'lambda; 'metric', 'value', and each row is a different value and not a list
        results_by_reward_type = pd.DataFrame([(reward_type['reward_type'], name, metric, value) for name in results_by_reward_type.keys() 
                                            for metric in results_by_reward_type[name].keys() 
                                            for value in results_by_reward_type[name][metric]], columns=['reward_type', 'model', 'metric', 'value'])
        results_by_reward_type['model'] = results_by_reward_type['model'].str.replace(f'-{env_name}', '')
        all_results = pd.concat([all_results, results_by_reward_type])
        
    return all_results, avg_reward_over_time
```