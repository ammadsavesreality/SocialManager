import { BaseProfile, AnalyzedProfile } from '../types';

export const analyzeRelationships = (followers: BaseProfile[], following: BaseProfile[]): AnalyzedProfile[] => {
    const followerMap = new Map(followers.map(f => [f.username.toLowerCase(), f]));
    const followingMap = new Map(following.map(f => [f.username.toLowerCase(), f]));
    
    const results: AnalyzedProfile[] = [];

    // Check Following list (Who I follow)
    // If they are NOT in followerMap -> They don't follow back (Ghost/DontFollowBack)
    // If they ARE in followerMap -> Mutual
    following.forEach(f => {
        const lowerUser = f.username.toLowerCase();
        if (followerMap.has(lowerUser)) {
            results.push({
                id: `mut-${lowerUser}`,
                username: f.username,
                profileUrl: f.profileUrl,
                type: 'mutual',
                status: 'pending'
            });
        } else {
            results.push({
                id: `dfb-${lowerUser}`,
                username: f.username,
                profileUrl: f.profileUrl,
                type: 'dont_follow_back',
                status: 'pending'
            });
        }
    });

    // Check Followers list (Who follows me)
    // If they are NOT in followingMap -> Fan (I don't follow them)
    // Mutuals already handled above
    followers.forEach(f => {
        const lowerUser = f.username.toLowerCase();
        if (!followingMap.has(lowerUser)) {
            results.push({
                id: `fan-${lowerUser}`,
                username: f.username,
                profileUrl: f.profileUrl,
                type: 'fan',
                status: 'pending'
            });
        }
    });

    return results;
};
