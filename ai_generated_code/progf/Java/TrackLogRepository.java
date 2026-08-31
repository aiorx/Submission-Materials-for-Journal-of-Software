package blck.wayd.data.dao;

import blck.wayd.data.entity.TrackLog;
import blck.wayd.model.dto.ConsecutiveAppUsageDto;
import blck.wayd.model.dto.DayAppUsageDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

/**
 * Track Log Repository.
 */
public interface TrackLogRepository extends JpaRepository<TrackLog, UUID> {

    /*
        Query Assisted with basic coding tools :D
        TODO: remove this when tracker logic will be updated
     */
    @Query(value = """
            with ranked_data as (select app_name,
                                        timestamp,
                                        row_number() over (order by timestamp) -
                                        row_number() over (partition by app_name order by timestamp) as group_id
                                 from track_log
                                 where user_id = :userId
                                   and (coalesce(:appsWhitelist) is null or app_name in :appsWhitelist)
                                   and (coalesce(:appsBlacklist) is null or app_name not in :appsBlacklist))
            select app_name       as app_name,
                   min(timestamp) as first_usage_timestamp,
                   max(timestamp) as last_usage_timestamp
            from ranked_data
            group by app_name, group_id
            having min(timestamp) <> max(timestamp)
            order by first_usage_timestamp;
            """, nativeQuery = true)
    List<ConsecutiveAppUsageDto> findConsecutiveAppUsageByUserId(
            UUID userId,
            @Param("appsWhitelist") Collection<String> appsWhitelist,
            @Param("appsBlacklist") Collection<String> appsBlacklist);

    /*
        Query Assisted with basic coding tools :D
            i'm scary of it..
        TODO: rewrite this when tracker logic will be updated
    */
    @Query(value = """
            with ranked_data as (select app_name,
                                        timestamp,
                                        to_timestamp(timestamp):: date                               as usage_day,
                                        row_number() over (order by timestamp) -
                                        row_number() over (partition by app_name order by timestamp) as group_id
                                 from track_log
                                 where user_id = :userId
                                   and timestamp >= extract(epoch from (current_date - interval '14 days'))
                                   and (coalesce(:appsWhitelist) is null or app_name in (:appsWhitelist))
                                   and (coalesce(:appsBlacklist) is null or app_name not in (:appsBlacklist)))
            select app_name             as app_name,
                   usage_day            as usage_day,
                   sum(max_ts - min_ts) as usage_seconds
            from (select app_name,
                         usage_day,
                         group_id,
                         min(timestamp) as min_ts,
                         max(timestamp) as max_ts
                  from ranked_data
                  group by app_name, usage_day, group_id
                  having min(timestamp) <> max(timestamp)) as session_data
            group by app_name, usage_day
            order by usage_day, app_name;
            """, nativeQuery = true)
    List<DayAppUsageDto> findAppUsageBreakdownByUserId(
            UUID userId,
            @Param("appsWhitelist") Collection<String> appsWhitelist,
            @Param("appsBlacklist") Collection<String> appsBlacklist);
}
