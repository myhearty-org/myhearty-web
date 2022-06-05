import { CharitableAidApplicationRow } from './charitable-aid-application-row';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { CharitableAidApplication } from '@myhearty/lib/types';
import { getCharitableAidApplications } from '@myhearty/lib/users/charitable-aid-applications';
import { Loading } from '@myhearty/ui/loading';
import { Table, Td, Th, Tr } from '@myhearty/ui/table';
import { handleRequest, PaginationMetadata } from '@myhearty/utils/api';
import { useEffect, useState } from 'react';

export function CharitableAidApplicationsTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [charitableAidApplications, setCharitableAidApplications] = useState<CharitableAidApplication[]>([]);
  const [paginationMetadata, setPaginationMetadata] = useState<PaginationMetadata>();

  useEffect(() => {
    async function getCharitableAidApplicationsData() {
      setIsLoading(true);

      try {
        const { charitableAidApplications, paginationMetadata } = await getCharitableAidApplications();

        setCharitableAidApplications(charitableAidApplications);
        setPaginationMetadata(paginationMetadata);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    }
    handleRequest(getCharitableAidApplicationsData);
  }, []);

  return (
    <Loading isLoading={isLoading}>
      <Table
        head={
          <tr>
            <Th>Charitable Aid</Th>
            <Th className="text-center">Status</Th>
            <Th>Status Update Date</Th>
          </tr>
        }
        body={
          <>
            {isLoading && (
              <Tr>
                <Td className="h-14 whitespace-nowrap text-sm leading-5 text-gray-400" colSpan={6}>
                  Retrieving charitable aid application records
                </Td>
              </Tr>
            )}
            {!isLoading && charitableAidApplications.length == 0 && (
              <Tr>
                <Td className="h-14 whitespace-nowrap text-sm leading-5 text-gray-400" colSpan={6}>
                  <div className="flex items-center opacity-80">
                    <ExclamationCircleIcon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400" />
                    <span>No charitable aid application records found</span>
                  </div>
                </Td>
              </Tr>
            )}
            {charitableAidApplications.length > 0 && (
              <>
                {charitableAidApplications.map((charitableAidApplication) => (
                  <CharitableAidApplicationRow
                    key={charitableAidApplication.id}
                    charitableAidApplication={charitableAidApplication}
                  />
                ))}
              </>
            )}
          </>
        }
      />
    </Loading>
  );
}