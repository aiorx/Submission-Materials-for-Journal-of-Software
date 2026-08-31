package com.example.helb_mobile1.main.leaderboard;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.helb_mobile1.R;
import com.example.helb_mobile1.main.AppViewModelFactory;
import com.example.helb_mobile1.main.IOnFragmentVisibleListener;

import com.google.android.material.tabs.TabLayout;



public class LeaderboardFragment extends Fragment implements IOnFragmentVisibleListener {
    /*
    One of the 4 main fragments in MainActivity, handles what is related to the leaderboard tab
     */

    private LeaderboardAdapter adapter;
    private TabLayout tabLayout;

    private LeaderboardViewModel leaderboardViewModel;

    private static final String GLOBAL = "Global";
    private static final String DAILY = "Quotidien";

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        /*
        upon creation of fragment, handles views and sets up the leaderboard and it's adapter,
        triggers initial methods
         */
        View view = inflater.inflate(R.layout.fragment_leaderboard, container, false);

        //code Aided using common development resources
        tabLayout = view.findViewById(R.id.tab_layout);
        RecyclerView recyclerLeaderboard = view.findViewById(R.id.recyclerLeaderboard); //Recycler View
        recyclerLeaderboard.setLayoutManager(new LinearLayoutManager(getContext()));

        adapter = new LeaderboardAdapter(); //adapts the recycler View according to data given
        recyclerLeaderboard.setAdapter(adapter);


        AppViewModelFactory factory = new AppViewModelFactory(requireContext());
        leaderboardViewModel = new ViewModelProvider(this, factory).get(LeaderboardViewModel.class);

        leaderboardViewModel.setEmptyGlobalList();
        leaderboardViewModel.setEmptyDailyList();
        leaderboardViewModel.fetchLeaderboards();
        setupTabs();
        observeViewModel();



        return view;
    }

    private void setupTabs() {
        /*
        adds both daily and global tabs, to sort users by daily or global points
        adds listener for the tab selection so that adapter knows what data it should display
        Code Aided using common development resources, modified
         */
        tabLayout.addTab(tabLayout.newTab().setText(GLOBAL));
        tabLayout.addTab(tabLayout.newTab().setText(DAILY));


        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override public void onTabSelected(TabLayout.Tab tab) {
                if (tab.getPosition() == 0) {
                    adapter.updateList(leaderboardViewModel.getGlobalList().getValue());
                } else {
                    adapter.updateList(leaderboardViewModel.getDailyList().getValue());
                }
            }
            @Override public void onTabUnselected(TabLayout.Tab tab) {}
            @Override public void onTabReselected(TabLayout.Tab tab) {}
        });

    }
    private void observeViewModel(){
        leaderboardViewModel.getDailyList().observe(getViewLifecycleOwner(), dailyList -> {
            if (tabLayout.getSelectedTabPosition() == 1) {
                adapter.updateList(dailyList);
            }
        });
        leaderboardViewModel.getGlobalList().observe(getViewLifecycleOwner(), globalList -> {
            if (tabLayout.getSelectedTabPosition() == 0) {
                adapter.updateList(globalList);
            }
        });
    }

    @Override
    public void onFragmentVisible() {

    }
}
