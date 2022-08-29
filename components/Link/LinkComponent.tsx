import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Code,
  Badge,
  Button,
  Link,
  Spacer,
  IconButton,
  Spinner,
  Modal,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import EditForm from "./EditForm";

export const LinkComponent = ({ idLink }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, isLoading, isError } = useQuery(["link" + idLink], () =>
    client.get(`Link/getLink?idLink=${idLink}`)
  );
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    ["link" + idLink],
    (values) => client.post("/Link/updateLink", values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["link" + idLink]);
      },
    }
  );
  const handleEdit = (values) => {
    mutate(values);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <EditForm onClose={onClose} idLink={idLink} onSubmit={handleEdit} />
      </Modal>
      <Box
        minW="350px"
        maxW={"350px"}
        w={"full"}
        //bg={"teal.800"}
        backdropBlur={"sm"}
        boxShadow={"md"}
        rounded={"md"}
        overflow={"hidden"}
        borderWidth={2}
        dropShadow={"md"}
      >
        <Box m="2%">
          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <Text>Error</Text>
          ) : (
            <>
              <HStack>
                <VStack w="80px" h="80px">
                  <Image
                    src={data?.data?.picUrl}
                    alt="logo"
                    boxSize="80px"
                    borderRadius={"10%"}
                    shadow={"outline"}
                    w="full"
                  />
                </VStack>
                <VStack maxW="200px" alignItems={"left"}>
                  <Heading size="md" noOfLines={1}>
                    {data?.data?.title}
                  </Heading>
                  <Link href={data?.data?.url} isExternal w="120%">
                    <Text noOfLines={1}>{data?.data?.url}</Text>
                  </Link>
                </VStack>
                <Spacer />
                <VStack alignSelf={"flex-start"}>
                  <IconButton
                    aria-label="Edit Link"
                    icon={<EditIcon />}
                    size="sm"
                    variant="outline"
                    colorScheme="teal"
                    onClick={() => {
                      onOpen();
                    }}
                  />
                </VStack>
              </HStack>
              <HStack mt="2%" mb="2%" alignSelf={"flex-end"}>
                {data?.data?.tags.map((tag) => (
                  <Badge key={tag?.Tag?.idTag} colorScheme={tag?.Tag?.tagColor}>
                    {tag?.Tag?.tagName}
                  </Badge>
                ))}
              </HStack>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};
