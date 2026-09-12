import { useEffect } from 'react';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { TimerStatus } from '../../features/timer/types';

export function useOledDeskMode(status: TimerStatus) {
  useEffect(() => {
    if (status === 'RUNNING') {
      activateKeepAwakeAsync('focus_session_desk_mode').catch(() => {});
    } else {
      deactivateKeepAwake('focus_session_desk_mode').catch(() => {});
    }

    return () => {
      deactivateKeepAwake('focus_session_desk_mode').catch(() => {});
    };
  }, [status]);
}
