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
    @Query(value = "\n" +
"with ranked_data as (select app_name,\n" +
"                            timestamp,\n" +
"                            row_number() over (order by timestamp) -\n" +
"                            row_number() over (partition by app_name order by timestamp) as group_id\n" +
"                     from track_log\n" +
"                     where user_id = :userId\n" +
"                       and (coalesce(:appsWhitelist) is null or app_name in :appsWhitelist)\n" +
"                       and (coalesce(:appsBlacklist) is null or app_name not in :appsBlacklist))\n" +
"select app_name       as app_name,\n" +
"       min(timestamp) as first_usage_timestamp,\n" +
"       max(timestamp) as last_usage_timestamp\n" +
"from ranked_data\n" +
"group by app_name, group_id\n" +
"having min(timestamp) <> max(timestamp)\n" +
"order by first_usage_timestamp;\n", nativeQuery = true)
    List<ConsecutiveAppUsageDto> findConsecutiveAppUsageByUserId(
            UUID userId,
            @Param("appsWhitelist") Collection<String> appsWhitelist,
            @Param("appsBlacklist") Collection<String> appsBlacklist);

    /*
        Query Assisted with basic coding tools :D
            i'm scary of it..
        TODO: rewrite this when tracker logic will be updated
    */
    @Query(value = "\n" +
"with ranked_data as (select app_name,\n" +
"                            timestamp,\n" +
"                            to_timestamp(timestamp):: date                               as usage_day,\n" +
"                            row_number() over (order by timestamp) -\n" +
"                            row_number() over (partition by app_name order by timestamp) as group_id\n" +
"                     from track_log\n" +
"                     where user_id = :userId\n" +
"                       and timestamp >= extract(epoch from (current_date - interval '14 days'))\n" +
"                       and (coalesce(:appsWhitelist) is null or app_name in (:appsWhitelist))\n" +
"                       and (coalesce(:appsBlacklist) is null or app_name not in (:appsBlacklist)))\n" +
"select app_name             as app_name,\n" +
"       usage_day            as usage_day,\n" +
"       sum(max_ts - min_ts) as usage_seconds\n" +
"from (select app_name,\n" +
"             usage_day,\n" +
"             group_id,\n" +
"             min(timestamp) as min_ts,\n" +
"             max(timestamp) as max_ts\n" +
"      from ranked_data\n" +
"      group by app_name, usage_day, group_id\n" +
"      having min(timestamp) <> max(timestamp)) as session_data\n" +
"group by app_name, usage_day\n" +
"order by usage_day, app_name;\n", nativeQuery = true)
    List<DayAppUsageDto> findAppUsageBreakdownByUserId(
            UUID userId,
            @Param("appsWhitelist") Collection<String> appsWhitelist,
            @Param("appsBlacklist") Collection<String> appsBlacklist);
}
